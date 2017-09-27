#!/usr/bin/python2
# -*- coding: utf-8 -*-
from PIL import Image
from psd_tools import PSDImage
import sys
import json
import os


def merge(frect, face):
    face_img = face.as_PIL()
    box = frect.bbox
    fbox = face.bbox
    img = Image.new("RGBA", (box.width, box.height), (255, 255, 255, 0))
    new_fi = face_img.crop((0, 0, fbox.width, fbox.height))
    img.paste(new_fi,
              (fbox.x1 - box.x1, fbox.y1 - box.y1, fbox.x1 - box.x1 + fbox.width, fbox.y1 - box.y1 + fbox.height))
    return img


print "start psd2atlas"

# check arguments
if len(sys.argv)!=2:
    print "[ERROR]Please pass psd file name as param! Such as: ./psd2atlas.py psdexample"
    exit(0)

filename = sys.argv[1]
psd = PSDImage.load(filename+".psd")
dir_name = filename+"/"
lh_info = {"faceRectX":0, "faceRectY":0}


if not os.path.exists(filename):
    os.makedirs(filename)
else:
    oldfiles = os.listdir(filename)
    for oldfile in oldfiles:
        os.remove(dir_name+oldfile)

# create an image with the whole psd size as the base_lh
lh_img = Image.new("RGBA", (psd.bbox.width, psd.bbox.height), (255, 255, 255, 0))

# get the face_rect from face group.
face_rect = None
for group in psd.layers:
    if group.name == 'face':
        for face in group.layers:
            if face.name == 'face_rect':
                face_rect = face
                break
        break


if face_rect is None:
    print "[ERROR]There is not face_rect layer in face group!"
    exit(0)


# iterate all the layers to get lh_base and face_xxx
for layer in psd.layers:
    name = layer.name
    if name == 'face':
        for face in layer.layers:
            if face.name == 'face_rect':
                continue

            print face.name
            img = merge(face_rect, face)
            img.save("%slh_%s_%s.png" % (dir_name, filename, face.name))
    elif name == 'lh_base':
        print name
        lh_box = layer.bbox
        lh_info["faceRectX"] = face_rect.bbox.x1
        lh_info["faceRectY"] = face_rect.bbox.y1
        lh_layer_image = layer.as_PIL()
        lh_img.paste(lh_layer_image, (lh_box.x1, lh_box.y1, lh_box.x2, lh_box.y2))
        lh_img.save("%slh_%s.png" % (dir_name, filename))

        with open("%slh_%s_info.json" % (dir_name, filename), 'w') as of:
            of.write(json.dumps(lh_info))

print "end"
