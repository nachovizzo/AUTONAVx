#!/usr/bin/python

import os
import numpy as np
import math

print "This script solves the excercises propossed in the Linear Algebra & 2D Geometry Lectures"

# --------------------------------------------------------------------------------------------------
# Length and Normalized Vector
v = np.array([4, 8, -4])
len_v = math.sqrt(pow(v[0], 2) + pow(v[1], 2) + pow(v[2], 2))
print "Length of v=" + str(v) + " is = " + str(len_v)

v_norm = v / len_v

print "Normalized vector" + str(v_norm) + ",length of normalized v =" + str(np.linalg.norm(v_norm))

# --------------------------------------------------------------------------------------------------
# Scalar and cross product

x1 = np.array([2, -4, 1])
x2 = np.array([2, 1, -2])
dot_product = x1[0] * x2[0] + x1[1] * x2[1] + x1[2] * x2[2]
print "The scalar product of x1= " + str(x1) + ",and x2= " + str(x2) + " ,is =  " + str(dot_product)

dot_product = np.dot(x1, x2)
print "The scalar product of x1= " + str(x1) + ",and x2= " + str(x2) + " ,is =  " + str(dot_product)

cross_product = np.cross(x1, x2)
print "The cross product of x1= " + str(x1) + ",and x2= " + str(x2) + " ,is =  " + str(cross_product)
