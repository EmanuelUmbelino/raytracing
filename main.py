import numpy as np
import matplotlib.pyplot as plt

def normalize(vector):
    return vector / np.linalg.norm(vector)

# dinamic size
width = 300
height = 200

camera = np.array([0, 0, 1]) # camera position
ratio = float(width) / height
screen = (-1, 1 / ratio, 1, -1 / ratio) # screen: left, top, right, bottom


image = np.zeros((height, width, 3)) # set black image in current size
# split the screen into width and height in the x and y directions
for i, y in enumerate(np.linspace(screen[1], screen[3], height)):
    for j, x in enumerate(np.linspace(screen[0], screen[2], width)):
        # calculate direction of current pixel
        pixel = np.array([x, y, 0])
        origin = camera
        direction = normalize(pixel - origin)
        
        # compute de color of current pixel
        # image[i, j] = ...
    print("progress: %d/%d" % (i + 1, height))

# convert image
plt.imsave('image.png', image)
