---
layout: page
title: Projekte
permalink: /projekte.html
---

# Projekte

Auf dieser Seite werden Projekte anderer Personen oder Organisationen aufgeführt, die im Rettungssport
interessant sind. Die Projekte sind weitestgehend unabhängig und ohne direkten Bezug zu {{ site.domain }},
werden hier aber wegen ihrer Relevanz für den Rettungssport aufgeführt:

<!-- markdownlint-disable MD033 -->

<div class="section-index">
    {% for post in site.docs  %}
    <div class="entry">
      <h5><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h5>
      <p>{{ post.description }}</p>
    </div>{% endfor %}
</div>
