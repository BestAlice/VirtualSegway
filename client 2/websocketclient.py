import asyncio
import websockets
import json
import time

async def hello():
    uri = "ws://192.168.43.95:8080"
    async with websockets.connect(uri) as websocket:
        #name = input("What's your name? ")

        #await websocket.send(name)
       # print(f"> {name}")
        start_time = time.time()
        my_json = json.dumps({"name":"clear"})
        await websocket.send(my_json)
        
        await asyncio.sleep(1)
        await websocket.send(json.dumps({"name":"start"}))
        targets = [[1, 1], [-1, 2], [4, 1], [0,0]]
        while (len(targets)):
            await asyncio.sleep(1)
            await websocket.send(json.dumps({"name":"settarget", "xT": targets[0][0], "yT": targets[0][1]}))
            del targets[0]


asyncio.get_event_loop().run_until_complete(hello())