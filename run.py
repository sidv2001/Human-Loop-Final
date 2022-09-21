#!/usr/bin/env python3

import csv
import cv2
import datetime
import json
import numpy as np
import os
import random
import string
import time
import traceback

from flask import Flask, render_template, send_file, request, redirect
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

class FlaskExample:

    def updateInProgressUUIDs():
            # Remove UUIDs that have not been updated for maxWaitTimeBeforeDeletingUUID
            uuidsToDelete = set()
            for uuidTemp in inProgressUUIDs:
                if time.time() >= inProgressUUIDs[uuidTemp] + maxWaitTimeBeforeDeletingUUID:
                    uuidsToDelete.add(uuidTemp)
            for uuidTemp in inProgressUUIDLogStateFiles:
                if uuidTemp not in inProgressUUIDs:
                    uuidsToDelete.add(uuidTemp)
            for uuidTemp in uuidsToDelete:
                if uuidTemp in inProgressUUIDs:
                    del inProgressUUIDs[uuidTemp]
                if uuidTemp in inProgressUUIDLogStateFiles:
                    inProgressUUIDLogStateFiles[uuidTemp].flush()
                    os.fsync(inProgressUUIDLogStateFiles[uuidTemp].fileno())
                    inProgressUUIDLogStateFiles[uuidTemp].close()
                    del inProgressUUIDLogStateFiles[uuidTemp]

    def run(self):
        app = Flask(
            __name__, static_url_path='/static', template_folder='./templates')
        app.secret_key = 'example_secret_key_change_this_later'

        # Called when a survey is submitted
        @app.route('/data', methods=['POST'])
        @cross_origin(origin='*',headers=['Content-Type','Authorization'], supports_credentials=True)
        def data():
            print(request.json)
            uuid = request.json['id']
            inProgressUUIDs[uuid] = time.time()

            fname ="outputs/{}.txt".format(uuid)

            if uuid not in inProgressUUIDLogStateFiles:
                inProgressUUIDLogStateFiles[uuid] = open(fname, "a")
            inProgressUUIDLogStateFiles[uuid].write(json.dumps(request.json, separators=(',', ':'))+"\n")

            return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

        # Called when a survey is submitted
        @app.route('/image', methods=['POST'])
        @cross_origin(origin='*',headers=['Content-Type','Authorization'])
        def image():
            # print(request)
            # print(request.form)
            # print(request.files)

            content = request.files['image'].read()
            width = int(request.form['width'])
            height = int(request.form['height'])
            fname = request.form['name']+".jpg"
            # print(len(content), height, width)
            # print(list(content)[0:100])
            # print(np.array(list(content), dtype=np.uint8))
            # print(np.array(content.decode('UTF-8').split(","), dtype=np.uint8))

            try:
                data = np.array(content.decode('UTF-8').split(","), dtype=np.uint8).reshape((height, width, -1))
            except:
                data = np.array(list(content), dtype=np.uint8).reshape((height, width, -1))
            if (data.shape[-1] == 4):
                # RBGA --> BGRA
                data = cv2.cvtColor(data, cv2.COLOR_RGBA2BGRA)
            data = np.flip(data, axis=0)
            # print(data, data.shape)

            dataSum = np.sum(data, axis=2)
            # print(dataSum, dataSum.shape)
            # print(data[np.where(np.sum(data, axis=2) > 0)])

            cv2.imwrite('outputs/three_js_images/%s' % fname, data)

            return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

        # Called when a survey is submitted
        @app.route('/features', methods=['POST'])
        @cross_origin(origin='*',headers=['Content-Type','Authorization'])
        def features():
            global featuresFile
            print(request.json)

            fname = "outputs/features.txt"

            if featuresFile is None:
                featuresFile = open(fname, "a")
            featuresFile.write(json.dumps(request.json, separators=(',', ':'))+"\n")

            return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

        app.debug = False
        app.run(host='0.0.0.0', port=8194, threaded=True) #Change the server url to amazon ec2
        # app.run(host='ec2-3-93-215-125.compute-1.amazonaws.com', port=8194, threaded=True)


if __name__ == '__main__':
    inProgressUUIDs = {} # uuid -> lastTimestepGotGameState
    maxWaitTimeBeforeDeletingUUID = 40*60 #  if no new log states are received within these many secs, delete this uuid from inProgressUUIDs
    inProgressUUIDLogStateFiles = {} # uuid -> file

    featuresFile = None

    server = FlaskExample()

    server.run()

    for uuidTemp in inProgressUUIDLogStateFiles:
        inProgressUUIDLogStateFiles[uuidTemp].flush()
        os.fsync(inProgressUUIDLogStateFiles[uuidTemp].fileno())
        inProgressUUIDLogStateFiles[uuidTemp].close()
