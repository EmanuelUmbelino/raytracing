import numpy as np
import matplotlib.pyplot as plt

# dinamic size
width = 300
height = 200

# camera position
camera = np.array([0, 0, 1])

ratio = float(width) / height

# screen: left, top, right, bottom
screen = (-1, 1 / ratio, 1, -1 / ratio)

# set black image in current size
image = np.zeros((height, width, 3))

# loop splitting the screen into width and height in the x and y directions
for i, y in enumerate(np.linspace(screen[1], screen[3], height)):
    for j, x in enumerate(np.linspace(screen[0], screen[2], width)):
        # compute de color of current pixel
        # image[i, j] = ...
        print("progress: %d/%d" % (i + 1, height))

# convert image
plt.imsave('image.png', image)