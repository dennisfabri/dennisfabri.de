---
layout: page
title: Neues
permalink: /
redirect_from:
  - /neues.html
  - /rettungssport.html
  - /index.php
search: false
---

<!-- markdownlint-disable -->

# Neues

{% for post in site.posts limit:4 %}
   <div class="post-preview">
   <h2><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h2>
   {% if post.badges %}{% for badge in post.badges %}<span class="badge badge-{{ badge.type }}">{{ badge.tag }}</span>{% endfor %}{% endif %}
   {{ post.content | split:'<!--more-->' | first }}
   {% if post.content contains '<!--more-->' %}
      <p><small><a href="{{ site.baseurl }}{{ post.url }}">[mehr lesen]</a></small></p>
   {% endif %}
   <span class="post-footer">{{ post.author}} {{ post.date | date: "%d.%m.%Y" }}</span>
   </div>
   <hr>
{% endfor %}

<p><a href="{{ site.baseurl }}/feed.xml">Nachrichten abonnieren (RSS-Format)</a>.</p>
