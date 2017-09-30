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
if len(sys.argv)!=3:
    print "[ERROR]Please pass psd file name as param! Such as: ./psd2atlas.py lh_test_nor stand,hug"
    exit(0)

prefix = sys.argv[1]
actions = sys.argv[2]
actionArr = actions.split(",")
dir_name = prefix + "/"

# create folder and clean original files
if not os.path.exists(prefix):
    os.makedirs(prefix)
else:
    oldfiles = os.listdir(prefix)
    for oldfile in oldfiles:
        os.remove(dir_name+oldfile)

lh_info = {}

for action in actionArr:
    filename = prefix+"_"+action
    print(filename)
    psd = PSDImage.load(filename + ".psd")

    lh_action_info = {"faceRectX": 0, "faceRectY": 0}

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
        print "[ERROR]There is not face_rect layer in face group of %s !" % filename
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
                img.save("%s%s_%s.png" % (dir_name, filename, face.name.replace("face_","")))
        elif name == 'lh_base':
            print name
            lh_box = layer.bbox
            lh_action_info["faceRectX"] = face_rect.bbox.x1
            lh_action_info["faceRectY"] = face_rect.bbox.y1
            lh_layer_image = layer.as_PIL()
            lh_img.paste(lh_layer_image, (lh_box.x1, lh_box.y1, lh_box.x2, lh_box.y2))
            lh_img.save("%s%s_base.png" % (dir_name, filename))
            lh_info[filename] = lh_action_info



    print("Fin process of %s !" % filename)

# save lh info
with open("%s%s_info.json" % (dir_name, prefix), 'w') as of:
    of.write(json.dumps(lh_info))

print "end"
