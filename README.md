codeindex
=========

wrapper for solr to index code on your local machine

Best tokenizer I found to be for JavaScript is this:

```xml
<tokenizer class="solr.PatternTokenizerFactory" pattern="[ \.\(\)\[\]\-;\'&quot;\\/]" group="-1"/>
```

<code>group="-1"</code> means the given regular expression is considered a delimiter-definition.

