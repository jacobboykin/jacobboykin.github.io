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
and SMS_G_System_OPERATING_SYSTEM.BuildNumber = "15063"
order by SMS_R_System.Name</code></pre>

<!--more-->

### All Devices Running v1607 (Anniversary Update)

<pre><code class="sql">select SMS_R_System.Name,
        SMS_G_System_OPERATING_SYSTEM.Name,
        SMS_G_System_OPERATING_SYSTEM.BuildNumber
from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM
on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId
where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%"
and SMS_G_System_OPERATING_SYSTEM.BuildNumber = "14393"
order by SMS_R_System.Name</code></pre>

### All Devices Running v1511 (November Update)

<pre><code class="sql">select SMS_R_System.Name,
        SMS_G_System_OPERATING_SYSTEM.Name,
        SMS_G_System_OPERATING_SYSTEM.BuildNumber
from  SMS_R_System inner join SMS_G_System_OPERATING_SYSTEM
on SMS_G_System_OPERATING_SYSTEM.ResourceID = SMS_R_System.ResourceId
where SMS_G_System_OPERATING_SYSTEM.Name like "%Windows 10%"
and SMS_G_System_OPERATING_SYSTEM.BuildNumber = "10586"
order by SMS_R_System.Name</code></pre>

### Not Sure How to Create SCCM Queries?

1.) Open the Config Manager Console and view the **Monitoring** section.

2.) Click on **Queries** in the sidebar menu and select **Create Query**

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/sccm-query-devices-running-windows-10/creatingAQuery_01.png"
  title="Creating A Query 01"%}

3.) Enter the name of the query and select **Edit Query Statement...**.

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/sccm-query-devices-running-windows-10/creatingAQuery_02.png"
  title="Creating A Query 02"%}

4.) Click on **Show Query Langauge** to paste in your WQL, or use the **Query Design** interface to create the query.

{% include image_caption.html
  imageurl="https://jacobboykin.com/images/posts/sccm-query-devices-running-windows-10/creatingAQuery_03.png"
  title="Creating A Query 03"%}

5.) In the Create Query Wizard select **Next**, **Next** and **Close**. The Wizard will let you know if your WQL syntax is incorrect.

6.) That's it - you should be able to run your query now! :fire:

{% include image_caption.html
  imageurl="https://media.giphy.com/media/8Ry7iAVwKBQpG/giphy.gif"
  title="Adventure Time"%}
