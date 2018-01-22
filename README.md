# The javascript portion of this project is stored in the directory public/SchematicEditor.

# The goal of this project is to make an open source schematic capture and PCB layout tool that is 100% browser based. 

The rest of the files in the project are the files required for a laravel PHP system to provide server side storaage of data. 
The javascript portion is the main focus and is designed to be able to be used with out the server side functionality so that this tool can be intergrated in to what ever system desired as the end product. 


Stay tuned for updates in this.
This software is not production ready and has almost none of the required functionality as of now.

# Implmented features include.
- Schematic symbol creation tool
  - Captures pin locations on symbol
  - Captures pin locations on pcb pad
- Schematic layout of symbols
  - Placement of symbols in workspace
  - Orientation of symbols in workspace
- Connection tool
  - Captures symbol id and pin for a from and to device
  - Visualises the connnection as a line between the connected points
  - Allows creation of points on a connection to jog line arround other entitys
  - Displays data in table for each connection (symbol and pin IDs)
- Net List
  -Generate a net list from the componet list
    - identifies points of the same potential
    - ignores junctions from list
    - stored as independant data structure and generated on demand.
- PCB layout tool
  - Placement of pads and roatation
  - Asigment and checking for net id to overlapping objects 
  
  
# Todo
- PCB layout tool
  - impliment output of data for pick and place
  - impliment output of image for creation of boards using a lithographic process
  
