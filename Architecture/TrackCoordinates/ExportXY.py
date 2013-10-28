#!/usr/bin/env python

import inkex
import sys

class TemplateEffect(inkex.Effect):
    def __init__(self):
        # Call base class construtor.
        inkex.Effect.__init__(self)
        
  
        

    def effect(self):

    	svg = self.document.getroot()
    	height = int(svg.get('height'))
        
        #Loop through all the selected items in Inkscape
        for node in self.selected.iteritems():
        
	        #Create the string variable which will hold the formatted data (note that '\n' defines a line break)
	        outputString = ""
			
	        #Iterate through all the selected objects in Inkscape
	        for id, node in self.selected.iteritems():
		     		#Check if the node is a path ( "svg:path" node in XML ) 
             		if node.tag == inkex.addNS('path','svg'):
		
	    	    		#Create the string variable which will hold the formatted data (note that '\t' defines a tab space)
	    	    		outputString += ""
		
	    	    		#The 'd' attribute is where the path data is stored as a string
	    	    		pathData = node.get('d')
	
	    	    		#Split the string with the espace character, thus getting an array of the actual SVG commands
	    	    		pathData = pathData.split(' ')

	    	    		command, tail = pathData[0], pathData[1:]

	    	    		origin, tail = tail[0], tail[1:]

	    	    		originCoordinates = origin.split(',')
	    	    		originx = float(originCoordinates[0])
	    	    		originy = float(originCoordinates[1])

	    	    		outputString += str(originx) + ", " + str(originy) + "\n"
	
	    	    		#Iterate through all the coordinates, ignoring the 'M' (Move To) and 'z' (Close Path) commands - note that any other command (such as bezier curves) will be unsupported and will likely make things go wrong
	    	    		for i in range( len(tail) ):
	    	        		#If there is a comma, we know that we are dealing with coordinates (format "X,Y") - ignoring any other SVG command (such as 'M', 'z', etc.)
	    	        		if tail[i].find(',') >= 0:
	    	        			currentCoordinates = tail[i].split(',')
	    	            			#Get the X and Y coordinates
	    	            			originx += float(currentCoordinates[0])
	    	            			originy += float(currentCoordinates[1])
	    	            			#Add them as a new 'vertice' node containing the coordinates as the 'x' and 'y' attributes
	    	            			
	    	            			outputString += str(originx) + ", " + str(originy) + "\n"
	
	    	    		

        
		sys.stderr.write(outputString)

# Create effect instance and apply it.
effect = TemplateEffect()
effect.affect()

#m 217.32143,642.46429 599.82144,0 40.35713,28.21429 19.66282,8.18543 24.84609,2.57345 24.39732,-2.56693 21.89731,-8.10265 192.14076,-139.76591 5.6857,-6.27097 0.8169,-5.74999 -6.8277,-9.7664 -48.5612,-41.94391 0.1078,-383.929061
