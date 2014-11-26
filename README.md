codeindex
=========

wrapper for solr to index code on your local machine

Best analyzer configuration I found to be for JavaScript is this:

```xml
<analyzer type="index">
    <tokenizer class="solr.StandardTokenizerFactory"/>
    <filter class="solr.EdgeNGramFilterFactory" minGramSize="3" maxGramSize="24"/>
    <filter class="solr.LowerCaseFilterFactory"/>
</analyzer>
```

<code>group="-1"</code> means the given regular expression is considered a delimiter-definition. The NGram filter will chop all tokens into parts from 3 to, if present 24 characters in length. This helps in finding partial results, which makes matching, and searching faster.

