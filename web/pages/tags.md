---
title: Tags
permalink: /tags.html
search: false
---

<h1 id="tags-index">Tags</h1>
{% capture site_tags %}{% for tag in site.tags %}{% if tag %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endif %}{% endfor %}{% endcapture %}{% assign docs_tags = "" %}{% for doc in site.docs %}{% assign ttags = doc.tags | join:',' | append:',' %}{% assign docs_tags = docs_tags | append:ttags %}{% endfor %}
{% assign all_tags = site_tags | append:docs_tags %}{% assign tags_list = all_tags | split:',' | uniq | sort %}

{% for tag in tags_list %}{% if tag %}<h3 id="{{ tag | replace: '/', '-' }}" class="linked-section">{{ tag }}</h3>
<div class="post-list" style="margin-bottom:40px">
    {% for post in site.tags[tag] %}<div class="tag-entry">
    <a href="{{site.baseurl}}{{- post.url -}}">{{- post.title -}}</a>
    <time datetime="{{- post.date | date_to_xmlschema -}}"> {{- post.date | date: "%d.%m.%Y" -}}</time>
</div>{%- endfor -%}
{% for doc in site.docs %}{% if doc.tags contains tag %}
<div class="tag-entry">
    <a href="{{- site.baseurl -}}{{- doc.url -}}">{{ doc.title }}</a>
        <time datetime="{{- doc.date | date_to_xmlschema -}}"> {{- doc.date | date: "%d.%m.%Y" -}}</time>
    </div>{% endif %}{% endfor %}
</div>{% endif %}{%- endfor -%}
