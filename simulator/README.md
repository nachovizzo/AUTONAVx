## Installing the Simulator on your computer

### Pre-Install Step:
  - To determine the version of python that is installed on your computer run the following command:
    ```sh
    $ python -V
    ```

 - If python is not installed or an error is shown from the above command you can download python here: https://www.python.org/downloads/

### From the forum post by BSam:
 - Step 1: Download the zip file: [autonav.in.tum.de/autonavx_demo.zip](http://autonav.in.tum.de/autonavx_demo.zip)
 - Step 2: Unzip to a directory, then navigate into the directory
 - Step 3: While still inside the directory, run this command (keep it running):
(Python 2.x)
    python -m SimpleHTTPServer
(Python 3.x)
    python -m http.server
 - Step 4: Open the browser, go to URL: localhost:8000/test.html

### Verify the web server is running:
 - For SimpleHTTPServer the following text should appear to let you know its running: "Serving HTTP on 0.0.0.0 port 8000 ..."
 - Pinging localhost can be another way to see if its running, there should be a reply.
    ping localhost
