Submission comes in two flavors, local and remote. When developing problems yourself, you can run the Solver in your own environment without the need to set up a server.

However, when using this tool with students, using a server to prevent exploitation of the underlying code is a necessity.

The Submission manager provides a function interface that can either 
(1) call in to the local instance of Pyodide and execute the code, or 
(2) make an HTTP request to a server with the student answers and return solution data.