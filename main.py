import numpy as np
import matplotlib.pyplot as plt

def normalize(vector):
    return vector / np.linalg.norm(vector)

def sphere_intersect(center, radius, ray_origin, ray_direction):
    b = 2 * np.dot(ray_direction, ray_origin - center)
    c = np.linalg.norm(ray_origin - center) ** 2 - radius ** 2
    delta = b ** 2 - 4 * c
    if delta > 0:
        t1 = (-b + np.sqrt(delta)) / 2
        t2 = (-b - np.sqrt(delta)) / 2
        if t1 > 0 and t2 > 0:
            return min(t1, t2)
    return None

def nearest_intersected_object(objects, ray_origin, ray_direction):
    distances = [sphere_intersect(obj['center'], obj['radius'], ray_origin, ray_direction) for obj in objects]
    nearest_object = None
    min_distance = np.inf
    for index, distance in enumerate(distances):
        if distance and distance < min_distance:
            min_distance = distance
            nearest_object = objects[index]
    return nearest_object, min_distance

# dinamic size
width = 300
height = 200

camera = np.array([0, 0, 1]) # camera position
ratio = float(width) / height
screen = (-1, 1 / ratio, 1, -1 / ratio) # screen: left, top, right, bottom

objects = [
    { 'center': np.array([-0.2, 0, -1]), 'radius': 0.7 },
    { 'center': np.array([0.1, -0.3, 0]), 'radius': 0.1 },
    { 'center': np.array([-0.3, 0, 0]), 'radius': 0.15 }
]

image = np.zeros((height, width, 3)) # set black image in current size
# split the screen into width and height in the x and y directions
for i, y in enumerate(np.linspace(screen[1], screen[3], height)):
    for j, x in enumerate(np.linspace(screen[0], screen[2], width)):
        # calculate direction of current pixel
        pixel = np.array([x, y, 0])
        origin = camera
        direction = normalize(pixel - origin)
        
        # check for intersections
        nearest_object, min_distance = nearest_intersected_object(objects, origin, direction)
        if nearest_object is None:
            continue

        # compute intersection point between ray and nearest object
        intersection = origin + min_distance * direction
        
        # compute de color of current pixel
        # image[i, j] = ...
    print("progress: %d/%d" % (i + 1, height))

# convert image
plt.imsave('image.png', image)
