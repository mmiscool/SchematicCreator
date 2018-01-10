# The javascript portion of this project is stored in the directory public/SchematicEditor.

# The goal of this project is to make an open source schematic capture and PCB layout tool that is 100% browser based. 

The rest of the files in the project are the files required for a laravel PHP system to provide server side storaage of data. 
The javascript portion is the main focus and is designed to be able to be used with out the server side functionality dso that this tool can be intergrated in to what ever system desired as the end product. 


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
    - Lacking currently the capability of placing jogs in a conection line (visualised as a direct line)
  - Displays data in table for each connection (symbol and pin IDs)
- PCB layout tool
  - data structures in place to hold symbol placement and orientation
  - No other devemloment has taken place yet.
  
  
# Todo
- Connection tool
  - Add capability of placing points on line connection objects to shape the path
  - Selection of conection line from the graphics area.
- PCB layout tool
  - EVERY THING !!!!!!!!!!
