codeindex
=========

wrapper for solr to index code on your local machine

Best tokenizer I found to be for JavaScript is this:

```xml
<analyzer type="index">
    <tokenizer class="solr.PatternTokenizerFactory" pattern="[ \.\(\)\[\]\-;\'&quot;\\/]" group="-1"/>
    <filter class="solr.EdgeNGramFilterFactory" minGramSize="3" maxGramSize="24"/>
    <filter class="solr.LowerCaseFilterFactory"/>
</analyzer>
```

<code>group="-1"</code> means the given regular expression is considered a delimiter-definition.

