


/**************** *
* Feature Overview *
***************** */

Rather than using the fixed positions given to us, we decides to have our application logically arrange the nodes. "Clusters" are separated to allow easy visualization of occuring transations


Node name is displayed on the node for easy identification of nodes, and can be shown/hidden to allow the user to focus only on the information they want to see.

Price data is displayed by hovering over a link, something that the user will quickly and easily discover as soon as they start moving their mouse on the page. Links will highlight themselves so it is obvious to the user what is happening. Price data being hidden by default, until the user interacts, helps to prevent information overload and only appears when the wants to see it. In addition to price data, addition properties are displayed in the lowere corner to give the user as much data as they may need.

Price data is also displayed when hovering over a node, displaying the price data on the all of the links that flow to/from the node. Additionally, other statistics are displayed on the node itself, such as total money flowing in and out of the node.

Link length is not proportional to cost as it may hurt user readability of the diagram, instead link length is optimized for organization.

edge thickness is proprtional to the market value of the assets on the edge.

*some design elements are incomplete at the time of submission



/**************** *
* Design Overview *
***************** */

We used the D3 library to provided the network view functionality. The bulk of our code is in js/network.js

The data provided is already in a useable and useful format, we directly reference the variables in the data.js file. 

We use force (D3 command) to go through all of the Nodes to have them displayed on screen.

We then add edges, all of this happens instantly is invisible to the user. Edge lenght is determined by numConnections array, which counts the number of edges flowing to a node. We increase the length of the edge if it is between two clusters, keeping clusters more separate from each other, and other nodes closer to the parent node within the cluster.