importClass(Packages.org.apache.solr.client.solrj.SolrQuery);
importClass(Packages.org.apache.solr.client.solrj.SolrServerException);
importClass(Packages.org.apache.solr.client.solrj.impl.CommonsHttpSolrServer);
importClass(Packages.org.apache.solr.client.solrj.response.QueryResponse);
importClass(Packages.org.apache.solr.common.SolrDocumentList);
importClass(Packages.org.apache.solr.common.SolrInputDocument);

var IOException             = java.io.IOException;
var ArrayList               = java.util.ArrayList;
var Collection              = java.util.Collection;

var url = "http://localhost:8983/solr"; // do we need to change this when we put into server
var server ;

var result = function (searchParameter) {

    var solr = new CommonsHttpSolrServer(url);

    var query = new SolrQuery();
    query.setQuery(String(searchParameter));
    query.addSortField("price", SolrQuery.ORDER.asc);
    //query.setHighlight(true).setHighlightSnippets(1);
    //query.setParam("hl.fl", "document");

    /*auto creation of a query
     * SolrQuery solrQuery = new  SolrQuery().
     setQuery("ipod").
     setFacet(true).
     setFacetMinCount(1).
     setFacetLimit(8).
     addFacetField("category").
     addFacetField("inStock");
     QueryResponse rsp = server.query(solrQuery);*/
    var res = [];
    var response = solr.query(query);
    var results = response.getResults();
    for (var i = 0; i < results.size(); ++i) {
        var obj = {};
        obj.result = results.get(i); // methana object 1k dala url 1 and text 1i dekama obanna
        res[i] = results.get(i);  // ara loder.js 1 dala thiyanawa wage.
    }

    return res;
}

var index = function () {
    server = new CommonsHttpSolrServer(url);

    var log = new Log();
    log.info('******* index hit ********'+ server );

    server.setMaxRetries(1);
    server.setConnectionTimeout(5000);
/*
    var doc1 = new SolrInputDocument();
    doc1.addField( "id", "id1");
    doc1.addField( "name", "doc1");
    doc1.addField( "price", 10 );

    var doc2 = new SolrInputDocument();
    doc2.addField( "id", "id2");
    doc2.addField( "name", "doc2");
    doc2.addField( "price", 20 );
    */

    var buddhi = new SolrInputDocument();
    buddhi.addField("id", "id6");
    buddhi.addField("name", "dilan");
    buddhi.addField("price", 50);

    var docs = new ArrayList();
    //docs.add( doc1 );
    //docs.add( doc2 );
    docs.add(buddhi);

    server.add(docs);
    server.commit();
}

