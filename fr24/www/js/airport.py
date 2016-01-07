#-*-coding:utf-8-*-
"""
<li>
<b>深圳</b>
<a title="深圳宝安机场" href="http://flights.ctrip.com/booking/airport-baoan/">宝安机场</a>
</li>
"""
from  bs4 import BeautifulSoup
import json
f = open("airport.html")
html = f.read()
f.close()

html_root = BeautifulSoup(html)
div_with_class_row =  html_root.findAll("div", {"class":"row"})

data = {}
_data = {}
for div in div_with_class_row:
    lis = div.findAll("li")
    for li in lis:
        b = li.find("b")
        a = li.find("a")
        data[b.text] = {"title": a.attrs["title"], "href":a.attrs["href"]}
        _data[b.text+"(" + a.attrs["title"]+")"] = {"title": a.attrs["title"], "href":a.attrs["href"]}

f = open("airport.json", "w+b")
print json.dump(data, f)
f.close()
f = open("iataobj.json", "r+b")
iata = json.load(f)
new_data = {}
for k,v  in iata.items():
    if v in data:
        new_data[k] = {"name":v, "href":data[v]["href"]}
    elif v in _data:
        new_data[k] = {"name":v, "href":_data[v]["href"]}
        

f = open("airport_data.json", "w+b")
print json.dump(new_data, f)
f.close()
print new_data

