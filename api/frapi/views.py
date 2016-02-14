#-*-coding:utf-8-*-
from django.shortcuts import render
from django.http import HttpResponse
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_protect,ensure_csrf_cookie
from .models import MyForm, UserRegisterForm
import requests
import datetime
import traceback
import json
import re
from django.core.cache import cache


def get_fr24_json(bounds  = None):
    print bounds
    # 连续获取失败2次则退出这次抓取
    #bounds1 = "53.08125433692244,9.602020446479761,88.0748085937521,-168.310546875"
    bounds1 = "55.229023057406344,33.00228416652958,73.13484375000098,136.7578125"
    bounds2 = "35.56798045801209,19.660503625269282,86.74277343749918,123.7939453125"
    count = 0
    headers = {"User-Agent":"User-Agent:Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36"}
 
    
    cur_date = datetime.datetime.now()
    if cur_date.hour>=0 and cur_date.hour<2:
        cur_date = cur_date - datetime.timedelta(1)
    
    cur_date = datetime.datetime(cur_date.year, cur_date.month, cur_date.day)

    flight_list = {}
    while count < 2:
        try:
            if bounds:
                bounds1 = bounds
            print "start request"
            r = requests.get("http://bma.data.fr24.com/zones/fcgi/feed.js?bounds=" + \
                bounds1+"&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=900&gliders=1&stats=1&",
                headers = headers,
                timeout = 60
            )
            print "end request", r.status_code
            if r.status_code != 200:
                return
            flight_list.update(r.json())
            print "start request"
            """
            r = requests.get("http://bma.data.fr24.com/zones/fcgi/feed.js?bounds=" + \
                bounds2+"&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=900&gliders=1&stats=1&",
                headers = headers,
                timeout = 60
            )
            print "end request", r.status_code
            if r.status_code != 200:
                return
            flight_list.update(r.json())
            """
            break
            
        except:
            count += 1
            traceback.print_exc()
            continue
    
    if count == 2:
        return
 
    szm_infos = {}
    age_infos = {}

    cur_flights = []
    airtu_flights = {}

   
    for f in flight_list:
        if isinstance(flight_list[f], list):
            frm_airport = flight_list[f][11].replace("CSX", "HHA").replace("LHW", "ZGC")
            to_airport = flight_list[f][12].replace("CSX", "HHA").replace("LHW", "ZGC")
            flightNo = flight_list[f][13]
            acNo = flight_list[f][9]
            acType = flight_list[f][8]
            lat =  flight_list[f][1]
            lng = flight_list[f][2]
            
            flight_age = age_infos.get(acNo, 0)
           
            if not flightNo or len(flightNo) == 0:
                continue
            
            airtu_flight = airtu_flights.get(flightNo, {})
            if airtu_flight.get("DepCode", "").upper() != frm_airport.upper() or \
                airtu_flight.get("ArrCode", "").upper() != to_airport.upper():
                airtu_flight = {}
                
           
            
           
            fl_info = {
                "date": cur_date.strftime("%Y-%m-%d"),
                "fltno": flightNo,
                "company": re.sub("\d+",  "", flightNo),
                "product": "", 
                "register": acNo,
                "type": acType,
                "departure_city_name": szm_infos.get(frm_airport, {}).get("cname", u""),
                "departure_airport_code": frm_airport,
                "departure_name": frm_airport,
                "destination_city_name": szm_infos.get(to_airport, {}).get("cname", u""),
                "destination_airport_code": to_airport,
                "destination_name": to_airport,
                "plan_launch": "",
                "plan_landing": "",
                "actual_launch": "",
                "actual_landing": "",
                "age": flight_age,
                "lat": lat,
                "lng": lng,
            }
            
            #plan_flight_info = get_fltPlan_by_no(fl_info)
            #print plan_flight_info, "==============="
            #if plan_flight_info:
            #   fl_info["plan_landing"] = cur_date.strftime("%Y-%m-%d") + " " + plan_flight_info.get("plan_landing", "")
            #    fl_info["plan_launch"] =  cur_date.strftime("%Y-%m-%d") + " " + plan_flight_info.get("plan_launch", "")
                
            cur_flights.append(fl_info)
            
            
    cache.set(bounds, cur_flights, 60*15)
    print len(cur_flights)
    
    return cur_flights
                
@ensure_csrf_cookie
def api_csrf(request):
    return HttpResponse("")
    
#@csrf_protect
def api_data(request):
    if request.method == "POST":
        form = MyForm(request.POST)
        
        data = get_fr24_json(request.GET.get("bounds"))
        return HttpResponse(json.dumps(data), content_type="application/json")
        
        #return render(request, "mytest.html", {"form":form})
    form = MyForm()
    return render(request, "mytest.html", {"form":form})
 
from django.contrib.auth import authenticate, login
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
import json

@require_http_methods(["POST",])
def api_auth(request):
    data = json.loads(request.body)

    print data
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        print user
        if user.is_active:
            login(request, user)
            # Redirect to a success page.
            
            return HttpResponse(json.dumps({"success":True}), content_type="application/json")  
        else:
            pass
            # Return a 'disabled account' error message
    else:
        return HttpResponse(json.dumps({"success":False}), content_type="application/json")  
        # Return an 'invalid login' error message.

    
@require_http_methods(["POST",])
def api_register(request):
    data = json.loads(request.body)

    print data
    username = data.get('username')
    password = data.get('password')
    form = UserRegisterForm(data=data)
    if form.is_valid() and form.save():
        return HttpResponse(json.dumps({"success":True}), content_type="application/json")  
       
    return HttpResponse(json.dumps({"success":False}), content_type="application/json")  

@login_required
@require_http_methods(["POST",])
def api_pos(request):
    request.user
    
        