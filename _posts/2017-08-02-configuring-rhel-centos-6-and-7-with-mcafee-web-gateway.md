---
layout: post
title: Configuring RHEL / CentOS 6 & 7 with McAfee Web Gateway 🚫
date: 2017-08-02
banner_image: centos-mcafee-proxy.png
tags: [Linux, Proxy, McAfee, CentOS, RHEL]
---

You can probably follow these steps to configure your hosts with other corporate proxies that use self-signed certs but keep in mind that I’ve only tested this with McAfee Web Gateway. Let’s begin! 💻

<!--more-->

1.) Fetch McAfee’s self-signed CA certificate using openssl:

<pre><code class="shell" >openssl s_client -connect google.com:443 -showcerts
</code></pre>

This will return the entire certificate chain. The last certificate in the chain should be McAfee’s CA certificate. Copy the certificate to your clipboard, making sure to include “ — -BEGIN CERTIFICATE — -” and “ — -END CERTIFICATE — -”

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/configuring-rhel-centos-6-and-7-with-mcafee-web-gateway/01.png"
  title="Certificate Format Example"%}

2.) Install ca-certificates package if it’s not already:

<pre><code class="shell" >sudo yum install ca-certificates -y
</code></pre>

3.) Use your favorite text editor to create a new .crt file at /etc/pki/ca-trust/source/anchors/. You can name it whatever you like as long you keep the .crt file extension. Paste in the CA certificate and save the file.

<pre><code class="shell" >sudo vim /etc/pki/ca-trust/source/anchors/mcafee.crt
</code></pre>

4.) Enable dynamic CA configuration:

<pre><code class="shell" >sudo update-ca-trust force-enable
</code></pre>

5.) Update your CA configuration:

<pre><code class="shell" >sudo update-ca-trust extract
</code></pre>

6.) Test it out 🙏…

wget: ✔️

<pre><code class="shell" >[jacob@host ~]$ wget https://jacobboykin.com
--2017-10-02 14:35:17--  https://jacobboykin.com/
Resolving jacobboykin.com (jacobboykin.com)... 104.27.164.184, 104.27.165.184, 2400:cb00:2048:1::681b:a4b8, ...
Connecting to jacobboykin.com (jacobboykin.com)|104.27.164.184|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: unspecified [text/html]
Saving to: ‘index.html.1’
[ <=>                                                                                                                                       ] 11,946      --.-K/s   in 0.001s
2017-10-02 14:35:18 (9.46 MB/s) - ‘index.html.1’ saved [11946]
[jacob@host ~]$
</code></pre>

git: ✔️

<pre><code class="shell" >[jacob@host ~]$ git clone https://github.com/jacobboykin/jacobboykin.github.io.git
Cloning into 'jacobboykin.github.io'...
remote: Counting objects: 265, done.
remote: Total 265 (delta 0), reused 0 (delta 0), pack-reused 265
Receiving objects: 100% (265/265), 4.21 MiB | 2.27 MiB/s, done.
Resolving deltas: 100% (117/117), done.
[jacob@host ~]$ ll jacobboykin.github.io/
total 36
-rw-rw-r--. 1 jacob jacob  233 Oct  2 14:43 404.md
-rw-rw-r--. 1 jacob jacob  640 Oct  2 14:43 about.md
-rw-rw-r--. 1 jacob jacob   15 Oct  2 14:43 CNAME
-rw-rw-r--. 1 jacob jacob 2221 Oct  2 14:43 _config.yml
drwxrwxr-x. 2 jacob jacob   59 Oct  2 14:43 css
-rw-rw-r--. 1 jacob jacob 1150 Oct  2 14:43 favicon.ico
-rw-rw-r--. 1 jacob jacob 1430 Oct  2 14:43 feed.xml
drwxrwxr-x. 2 jacob jacob   99 Oct  2 14:43 fonts
drwxrwxr-x. 3 jacob jacob   96 Oct  2 14:43 images
drwxrwxr-x. 2 jacob jacob  135 Oct  2 14:43 _includes
-rw-rw-r--. 1 jacob jacob 3235 Oct  2 14:43 index.html
drwxrwxr-x. 2 jacob jacob   66 Oct  2 14:43 js
drwxrwxr-x. 2 jacob jacob   60 Oct  2 14:43 _layouts
drwxrwxr-x. 2 jacob jacob  140 Oct  2 14:43 _posts
drwxrwxr-x. 2 jacob jacob   88 Oct  2 14:43 _sass
-rw-rw-r--. 1 jacob jacob 7869 Oct  2 14:43 style-guide.md
drwxrwxr-x. 2 jacob jacob   24 Oct  2 14:43 tags
[jacob@host ~]$
</code></pre>

npm: ✔️

<pre><code class="shell">[jacob@host ~]$ npm install express
/home/jacob
└─┬ express@4.16.1
  ├─┬ accepts@1.3.4
  │ ├─┬ mime-types@2.1.17
  │ │ └── mime-db@1.30.0
  │ └── negotiator@0.6.1
  ├── array-flatten@1.1.1
  ├─┬ body-parser@1.18.2
  │ ├── bytes@3.0.0
  │ ├─┬ http-errors@1.6.2
  │ │ ├── inherits@2.0.3
  │ │ └── setprototypeof@1.0.3
  │ ├── iconv-lite@0.4.19
  │ └── raw-body@2.3.2
  ├── content-disposition@0.5.2
  ├── content-type@1.0.4
  ├── cookie@0.3.1
  ├── cookie-signature@1.0.6
  ├─┬ debug@2.6.9
  │ └── ms@2.0.0
  ├── depd@1.1.1
  ├── encodeurl@1.0.1
  ├── escape-html@1.0.3
  ├── etag@1.8.1
  ├─┬ finalhandler@1.1.0
  │ └── unpipe@1.0.0
  ├── fresh@0.5.2
  ├── merge-descriptors@1.0.1
  ├── methods@1.1.2
  ├─┬ on-finished@2.3.0
  │ └── ee-first@1.1.1
  ├── parseurl@1.3.2
  ├── path-to-regexp@0.1.7
  ├─┬ proxy-addr@2.0.2
  │ ├── forwarded@0.1.2
  │ └── ipaddr.js@1.5.2
  ├── qs@6.5.1
  ├── range-parser@1.2.0
  ├── safe-buffer@5.1.1
  ├─┬ send@0.16.1
  │ ├── destroy@1.0.4
  │ └── mime@1.4.1
  ├── serve-static@1.13.1
  ├── setprototypeof@1.1.0
  ├── statuses@1.3.1
  ├─┬ type-is@1.6.15
  │ └── media-typer@0.3.0
  ├── utils-merge@1.0.1
  └── vary@1.1.2
npm WARN enoent ENOENT: no such file or directory, open '/home/jacob/package.json'
npm WARN jacob No description
npm WARN jacob No repository field.
npm WARN jacob No README data
npm WARN jacob No license field.
[jacob@host ~]$
</code></pre>

If you have any trouble with other applications, you might need to set your proxy strings in your environment file:

<pre><code class="shell" >sudo vim /etc/environment
</code></pre>

<pre><code class="shell" >http_proxy=”http://user:password@domain.example.com:port/"
https_proxy=”http://user:password@domain.example.com:port/"
ftp_proxy=”http://user:password@domain.example.com:port/"
</code></pre>

That’s it - I hope this is helpful! 🔥