---
layout:    default
permalink: "/nontechnical"
author:    lgarcia
keywords:  nontechnical
title:     Non-Technical Blog Posts
weight:    90
visible:   false
--- 



{% assign sorted_posts = site.categories['Non-Technical'] | reversed %}
<h3 id="nontechnical">Non-Technical Blog Posts</h3>
<ul class="category nontechnical">  
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