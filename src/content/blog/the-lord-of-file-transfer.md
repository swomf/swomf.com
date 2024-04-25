---
title: "The lord of file transfer"
description: "The best solution is one you make yourself: an introduction to Termux"
tags:
  - linux
  - programming
  - termux
pubDate: "Apr 24 2024"
updatedDate: "Apr 25 2024"
heroImage: "/accepting-files-on-a-termux-webserver.jpg"
---

File transfer is funny.

Usually people shove things onto Google Drive/Dropbox, email themselves, text
themselves, wait for their USB to finish writing, make a temporary file on
YetAnotherAnonShareSite.info, or even go through the steps of
_recreating the file manually_, by hand! (I admit to that one. In my defense,
I had no internet and it was only 40 lines of HTML.)

Pfft. It's a rare and minor hassle, right? Who cares? _So what_ if the email
service complains about your PDF being over 200MB, or your WiFi speed throws a
hissy fit for 2 minutes before loading the Drive page, or your USB has a
read/write speed in the millibytes? Let's just exchange glances awkwardly while
watching the progress bar update, then be done with it.

Nah. Let's forget this forever.

[Termux](https://f-droid.org/packages/com.termux/) is a free open-source Android
app that shoves a Linux terminal on your phone. It's useful for a load of tiny
day-to-day utilities, such as `ping` to lie-detect your "four bars of WiFi",
`yt-dlp` to borrow a couple YouTube playlists in the background, and `ffmpeg`
to turn said YouTube playlists into space-efficient audio files. It renders
services such as TotallyNotShadyYoutubeDownloader.xyz and Spotify Premium
useless and quaking in the face of Making Something Yourself.

Put this on your Android, and you'll be a walking server.

_Let's speed in._

<small>
NOTE: This guide assumes you installed Termux 5 seconds ago, and can
read error messages. And if you really *did* install Termux 5 seconds
ago, please run `pkg upgrade`.
</small>

## 1. Sending via `python3 -m http.server`

First, find your internal IP (or whatever you named your phone in your
settings app). This is how devices connected to your router will talk to your
phone.

```bash
$ ifconfig
lo:     ... # Loopback interface, ignore.
wlan0:  ... # Wireless interface. Look for "inet".
        inet 192.168.1.2 netmask 255.255.255.0 broadcast 192.168.1.255
```

Next, `cd` to `storage/downloads` or wherever you downloaded your file, then
start a HTTP server. (Make sure you have the python package.)

```bash
$ python3 -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
            # [::] just means "every network
            # interface on your device"
```

Now use a client machine to visit your device in a browser, e.g.
192.168.1.2:8000 or epicandroidname:8000, ignoring warnings complaining we're
on HTTP instead of HTTPS.

![Example of "Directory listing for /"](/pictures/the-lord-of-file-transfer-01.jpg)

Finally, <kbd><kbd>CTRL</kbd>+<kbd>C</kbd></kbd> will interrupt the program.

<b>
The `python3 -m http.server` oneliner is enough for most people and most
situations. In fact, I even `alias py=python3` in `.bashrc`, since doing this
operation in Windows uses `py -m http.server` (typing `python` in PowerShell
redirects you to Microsoft Store). If you want, you can stop here.
</b>

---

## 2. Sending/receiving via netcat-openbsd

Screw you! Time to read the manual instead.

```bash
$ man nc # See CLIENT/SERVER MODEL and DATA TRANSFER
         # press `/` to search within the manuals
```

Note: you may need to `pkg install netcat-openbsd`. <br />
Note: this requires 2 Linux-like machines (e.g. WSL, Termux, Linux).

---

## 3. Receiving over HTTPS via Flask

Some devices cannot download/upload from HTTP alone; they need to know the
connection is encrypted.

Flask is a lightweight Python webserver package. Since we're going to start
programming, you'll want to make a folder to store the following code (as
well as a folder for all of your coding projects).

```bash
# "~" is the HOME directory. Avoid putting code
# projects in the storage/ folder we were in, for
# filesystem permissions reasons.
$ mkdir -p ~/git/file-transfer
$ cd ~/git/file-transfer
```

Note that you'll need a text editor, like `nano` or `vim`, if you're developing
from your phone.

<details>
<summary> How do I use vim? </summary>
  <p class="ml-5">
  `vim` is an efficient modal text-editor for headless (non-GUI) environments,
  but it has a skill floor (try `vimtutor`). For the bare minimum:
    <li class="ml-10">Hit <kbd>i</kbd> to enter INSERT mode </li> 
    <li class="ml-10">Hit <kbd>ESC</kbd> then type <kbd>:wq!</kbd> to run the save and quit commands.</li> 
  </p>
</details>

### Step 1. Set up a Python project

It's good practice that we set up a virtual Python environment, instead of
installing loads of `pip` packages in the global environment that might conflict.

```bash
$ python3 -m venv env     # Use the Python packages
$ source env/bin/activate # local to your project,
                          # rather than your global
                          # Python install
(env) $ pip install flask
(env) $ echo 'env' >> .gitignore
(env) $ git init          # to save our work later
```

Stay in the (env) virtual environment for the rest of the project, until
we're done; then, we can run `deactivate` to return to global Python.

### Step 2. Look up the docs for Flask file uploads

Anyone can read and write copy-pastable code into a tutorial. But the spirit of
Termux is the spirit of Linux: we read manpages and debug errors. Let's go.

Search up
<a href="https://duckduckgo.com/?q=file+uploading+with+python+flask" target="_blank">
File uploading with Python Flask</a>.

Look for anything that says documentation... for me, it was this
<a href="https://flask.palletsprojects.com/en/2.3.x/patterns/fileuploads" target="_blank">
PalletsProjects 2.3.x link</a>. Let's skim it real quick.

Looks like we have example code from the docs itself; the docs are the tutorial.
Let's copy-paste this into a `main.py` file, changing the necessary fillers and
foobars into what we'll actually use.

```python
# --- FIRST CODE BLOCK in site ---
import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'storage' # Make sure to `mkdir` a storage directory for this
# Comment the line below out. Who cares? Let's upload anything!
# ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- SECOND CODE BLOCK in site ---
# Comment the ALLOWED_EXTENSIONS bit out
def allowed_file(filename):
    return '.' in filename #and \
           #filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # Comment this line out. If we look at the 4th block,
            # this will cause a redirect to the user-uploaded file
            # once they upload. That's unnecessary.
            # return redirect(url_for('download_file', name=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

# --- FOURTH CODE BLOCK in site ---
# Optimally we'd put this at the top but we're
# copy-pasting for now.
from flask import send_from_directory

# We can infer that <name> is for variable substitution
@app.route('/uploads/<name>')
def download_file(name):
    return send_from_directory(app.config["UPLOAD_FOLDER"], name)
```

### Step 3. Add SSL

When we run the app with `python3 main.py`, _nothing happens_. Let's search
up how to actually serve... while we're at it, let's
<a href="https://duckduckgo.com/?q=python+flask+run+app+with+https&t=ffab&ia=web)" target="_blank">
search up how to serve with HTTPS </a>specifically!

Looks like we've got no docs here. Next bet in the chain is StackOverflow,
before we start moving to tutorial websites and blog posts.

<a href="https://stackoverflow.com/questions/29458548/can-you-add-https-functionality-to-a-python-flask-web-server" target="_blank">
https://stackoverflow.com/questions/29458548/can-you-add-https-functionality-to-a-python-flask-web-server</a>

According to the question, we forgot to add `app.run()` at the end of our file.
Boohoo.

According to the
<a href="https://stackoverflow.com/a/42906465" target="_blank">
first answer</a>, we need to add the following to the end of our code:

```python
context = ('local.crt', 'local.key') #certificate and key files
app.run(debug=True, ssl_context=context)
```

but, according to one of the comments under said answer, instead of pre-making
these `local.crt` and `local.key` files, we can actually generate the SSL
_ad hoc_ instead, which means "on demand for a short time."

> To generate local.crt and local.key see Method 2 of:
> [kracekumar.com/post/54437887454/ssl-for-flask-local-development](kracekumar.com/post/54437887454/ssl-for-flask-local-development)  
> <cite> andyandy Jun 20, 2017 at 16:42</cite>

```python
# Totally copy-pasted this.
app.run('0.0.0.0', debug=True, port=8100, ssl_context='adhoc')
```

Now let's run it! Follow along with me.

```bash
$ mkdir storage # If you forgot to in step 2
$ python3 main.py
... blahblah, output ...
TypeError: Using ad-hoc certificates requires the cryptography library.

$ pip install cryptography # Fix that error
error: can\'t find Rust compiler
      To update pip, run:
          pip install --upgrade pip
      and retry package installation.
      This package requires Rust >=1.63.0.

$ pip install --upgrade pip
Requirement already satisfied

$ pkg install rust # Since it said we need a Rust compiler
$ pip install cryptography
error: Failed to find tool. Is `aarch64-linux-android-ar` installed?

$ pkg search aarch64 linux android
rust-std-aarch64-linux-android/stable [installed]
# Huh? Do we have it already? Well, we should search
# up our problem online now, then -- no clear way out.
```

<a href="https://duckduckgo.com/?q=error+is+aarch64+linux+ar+installed" target="_blank">DuckDuckGo</a>
shows us a
<a href="https://github.com/termux/termux-packages/discussions/8214" target="_blank">GitHub link</a>
that tells us to install `binutils`.

```bash
$ pkg in binutils
$ pip install cryptography
... blah blah, it worked~ ...

$ python3 main.py
...
* Running on all addresses (0.0.0.0)
* Running on https://127.0.0.1:8100
* Running on https://192.168.1.2:8100
...
```

Whew... _you better test it._ Upload a file to https:// whatever.
Do it. Check if it was received in our storage dir with `ls`. Do it.

### Step 4. Version control!

Whenever you get something done, commit your source code!

```bash
$ git add --all
$ git commit # You'll be put into vim or nano.
```

### Step 5. Add download functionality

We're not chumps. We go the full mile. Since we already have URLs that
can access uploaded content, all we need to do is add a way to conveniently
list them in our HTML. If you don't already know how to get these hyperlinks,
<a href="https://duckduckgo.com/q=how+to+make+a+link+in+html" target="_blank">
search it up
</a>
and skim the
<a href="https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks#anatomy_of_a_link" target="_blank">
docs
</a>
specifically.

```python
@app.route('/', methods=['GET', 'POST'])
def upload_file():
    # For each thing in the upload dir
    # add a hyperlink to its URL accessor
    files = ''
    for name in os.listdir(app.config['UPLOAD_FOLDER']):
        # Use string formatting to insert the name.s
        # Make sure you use 'uploads' since it is
        # the @app.route we're using.
        files += f'<li><a href="/uploads/{name}">{name}</a></li>'
    # ... code and stuff
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    ''' + '<br />' + files
    # Add the links to the end. Also, a <br>
    # linebreak will make it look nicer.
```

And now we have a cruddily cobbled file server. Commit and save.

```bash
file-transfer
├── App.py
├── env
│   └── ...
└── storage
    └── test.txt
```

<small>
Yes, this duct-taped code uses bad practices.
  <li>
  We returned HTML as a string rather than using Flask's Jinja templating
  engine.
  </li>
  <li>
  We didn't check if the files/directories we serve in storage/ are actually
  files, rather than folders. There are no size limits either.
  </li>
  <li>
  We used ad hoc instead of researching HTTPS, realizing Linux boxes use
  the openssl command to make certificates, then running the first 3 commands
  from `curl cht.sh/openssl | less`, which would be arguably easier for both end
  users who will now hit "Ignore cert warning" less often, and new Termux
  users who will be familiarized with basic SSL management and the
    <a href="https://cheat.sh" target="_blank">
    cheat.sh
    </a>
  website.
  </li>
  <li>
  We didn't add a `requirements.txt` via `pip freeze > requirements.txt`, nor
  did we add a `README.md` that explains how to use the project.
  </li>
But it works, it's tiny, and it isn't meant to be robust.
</small>
