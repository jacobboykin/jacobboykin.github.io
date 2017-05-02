---
layout: post
title: SCCM Query for Devices Running Windows 10
date: 2017-03-02
banner_image: sccm-windows10-query.png
tags: [SCCM, Windows, IT, Windows 10, WQL]
---

*Vualá!*

<pre><code class="sql">select SMS_R_System.Name,
        SMS_G_System_OPERATING_SYSTEM.Name,
        SMS_G_System_OPERATING_SYSTEM.BuildNumber
from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM
on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId
where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%"
order by SMS_R_System.Name</code></pre>

{% include image_caption.html
  imageurl="https://media.giphy.com/media/8Ry7iAVwKBQpG/giphy.gif"
  title="Adventure Time"%}
