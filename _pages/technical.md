---
layout:    default
permalink: "/technical"
author:    lgarcia
keywords:  technical
title:     Technical Blog Posts
weight:    90
visible:   false
--- 



{% assign sorted_posts = site.categories['Technical'] | reversed %}
<h3 id="technical">Technical Blog Posts</h3>
<ul class="category technical">  
    {% for post in sorted_posts %}
    {% unless post.draft %}

    {% if post.menutitle %}
    {% assign title = post.menutitle %}
    {% else %}
    {% assign title = post.title %}
    {% endif %}

    <li>
        <div class="article">
            <article class="article" itemscope itemtype="http://schema.org/BlogPosting">
                <header class="post-header">
                    <span class="title"><a itemprop="name" href="{{ post.url | absolute_url }}" title="{{ title }}">{{ title }}</a></span>
                    <time class="date" itemprop="datePublished" datetime="{{post.date | date: "%Y-%m-%d"}}">{{post.date | date: "%B %e, %Y"}}</time>
                </header>
            </article>
        </div>
    </li>
    {% endunless %}
    {% endfor %}
</ul>