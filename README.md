codeindex
=========

Wrapper for solr to index code on your local machine. This app creates a local site that, after you have installed and configured Solr, becomes a search engine for your own code. Works best with indexing JavaScript. Frontend made with Angular.

Best analyzer configuration I found to be for JavaScript is this:

```xml
<analyzer type="index">
    <tokenizer class="solr.StandardTokenizerFactory"/>
    <filter class="solr.EdgeNGramFilterFactory" minGramSize="3" maxGramSize="24"/>
    <filter class="solr.LowerCaseFilterFactory"/>
</analyzer>
```

The NGram filter will chop all tokens into parts from 3 to, if present 24 characters in length. This helps in finding partial results, which makes matching, and searching faster.

Stuff used: Solr, NodeJS, Express, Angular.

License: MIT