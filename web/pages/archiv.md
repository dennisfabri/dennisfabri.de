---
layout: page
title: Archiv
permalink: /archiv.html
search: false
---

# Archiv

<!-- markdownlint-disable MD033 -->

{% for post in site.posts  %}
{% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
{% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}

{% if forloop.first %}<h2 class="c-archives__year" id="{{ this_year }}-ref">{{this_year}}</h2>{% endif %}
<div class="tag-entry">
    <a href="{{- site.baseurl -}}{{- post.url -}}">{{ post.title }}</a>
        <time datetime="{{- post.date | date_to_xmlschema -}}"> {{- post.date | date: "%d.%m.%Y" -}}</time>
    </div>
{% if forloop.last %}{% else %}{% if this_year != next_year %}
<h2 class="c-archives__year" id="{{ next_year }}-ref">{{next_year}}</h2>
{% endif %}{% endif %}{% endfor %}
