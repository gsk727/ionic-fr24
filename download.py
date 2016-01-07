#-*-coding:utf-8-*-
import requests

from threading import Thread
from threading import Lock
g_lock  = Lock()

f = open("qq.zip", "w+b")


class DownloadThread(Thread):
    def __init__(self, start_pos,end_pos, *args, **kwargs):
        super(DownloadThread, self).__init__(*args, **kwargs)
        print start_pos, end_pos, "--------------"
        self.start_pos = start_pos
        self.end_pos = end_pos
       
        
    def run(self):
        headers = {"Range": "bytes="+str(self.start_pos)+"-"+str(self.end_pos)}
        print headers
        resp = requests.get("http://127.0.0.1:8000/static/a.zip", headers=headers)
        print resp.headers
        print g_lock.acquire()
        f.seek(0, self.start_pos)
        f.write(resp.content)
        f.flush()
        g_lock.release()
        
import sys
import os
if __name__ == "__main__":
    thread_num = int(sys.argv[1])
    headers={"Range":"bytes=0-1"}
    resp = requests.head("http://127.0.0.1:8000/static/a.zip")
    print resp.headers
    file_size = resp.headers["content-length"]
    print file_size
    start = 0
    step = int(file_size)/thread_num
    
    ts= []
    for x in range(0, thread_num):
        print x
        if x < thread_num -1:
            t = DownloadThread(start, start+step-1)
            t.start()
            ts.append(t)
            #t.join()
            start += step
        else:
            t = DownloadThread(start, file_size)
            t.start()
            ts.append(t)
            #t.join()
    for t in ts:
        t.join()
        
    f.close()
    print "====================="
    

        
        
        