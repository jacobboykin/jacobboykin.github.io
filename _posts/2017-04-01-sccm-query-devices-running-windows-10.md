---
layout: post
title: SCCM Query for Devices Running Windows 10
date: 2017-05-05
banner_image: sccm-windows10-query.png
tags: [SCCM, Windows, IT, Windows 10, WQL]
---

### All Devices Running Windows 10

<pre><code class="sql">select SMS_R_System.Name,
        SMS_G_System_OPERATING_SYSTEM.Name,
        SMS_G_System_OPERATING_SYSTEM.BuildNumber
from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM
on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId
where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%"
order by SMS_R_System.Name</code></pre>

### All Devices Running v1703 (Creator's Update)

<pre><code class="sql">select SMS_R_System.Name,
        SMS_G_System_OPERATING_SYSTEM.Name,
        SMS_G_System_OPERATING_SYSTEM.BuildNumber
from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM
on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId
where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%"
and SMS_G_System_OPERATING_SYSTEM.BuildNumber = "10.0.15063"
order by SMS_R_System.Name</code></pre>

### All Devices Running v1607 (Anniversary Update)

<pre><code class="sql">select SMS_R_System.Name,
        SMS_G_System_OPERATING_SYSTEM.Name,
        SMS_G_System_OPERATING_SYSTEM.BuildNumber
from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM
on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId
where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%"
and SMS_G_System_OPERATING_SYSTEM.BuildNumber = "10.0.14393"
order by SMS_R_System.Name</code></pre>

### All Devices Running v1511 (November Update)

<pre><code class="sql">select SMS_R_System.Name,
        SMS_G_System_OPERATING_SYSTEM.Name,
        SMS_G_System_OPERATING_SYSTEM.BuildNumber
from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM
on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId
where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%"
and SMS_G_System_OPERATING_SYSTEM.BuildNumber = "10.0.10586"
order by SMS_R_System.Name</code></pre>

*Vualá!*

{% include image_caption.html
  imageurl="https://media.giphy.com/media/8Ry7iAVwKBQpG/giphy.gif"
  title="Adventure Time"%}
