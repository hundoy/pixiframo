#!/usr/bin/python2
# -*- coding: utf-8 -*-
from PIL import Image
from psd_tools import PSDImage
import PIL


def merge(frect,face):
    face_img = face.as_PIL()
    box = frect.bbox
    fbox = face.bbox
    img = Image.new("RGBA", (box.width,box.height), (255,255,255,0))
    new_fi = face_img.crop((0,0,fbox.width,fbox.height))
    img.paste(new_fi, (fbox.x1-box.x1, fbox.y1-box.y1, fbox.x1-box.x1+fbox.width, fbox.y1-box.y1+fbox.height))
    return img


print "start"
psd = PSDImage.load("psdexample.psd")

face_rect = None
for group in psd.layers:
    if group.name == 'face':
        for face in group.layers:
            if face.name == 'face_rect':
                face_rect = face
                break
        break

if face_rect is None:
    print "there is not face_rect layer in face group!"
    exit(0)

for layer in psd.layers:
    name = layer.name
    if name == 'face':
        for face in layer.layers:
            if face.name == 'face_rect':
                continue

            print face.name
            img = merge(face_rect, face)
            img.save(face.name + ".png");
    elif name == 'lh_base':
        print name
        layer_image = layer.as_PIL()
        layer_image.save(name + ".png");

print "end"
