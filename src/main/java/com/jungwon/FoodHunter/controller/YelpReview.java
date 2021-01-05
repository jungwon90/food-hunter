package com.jungwon.FoodHunter.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;


import java.util.Arrays;
import java.util.List;

@RestController
public class YelpReview {
    
    @Value("${api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;


    @GetMapping("/yelp")
    public ResponseEntity<String> getYelpData(@RequestParam("searchInput") String searchInput ,@RequestParam("truckName") String truckName){
        System.out.println(searchInput + truckName);
        String url = "https://api.yelp.com/v3/businesses/search?location=SF?term=" + searchInput;
        //set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", apiKey);
        headers.set("cache-control", "no-cache");

        HttpEntity entity = new HttpEntity(headers);

        
        //to get the bussiness id, call Bussiness search endpoint
        ResponseEntity<String> businesses = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        String body = businesses.getBody();
        body = body.replace("{\"businesses\": ", "");
        body = body.replace(", \"total\": 1200, \"region\": {\"center\": {\"longitude\": -122.41619110107422, \"latitude\": 37.7489978935666}}}", "");
        
        System.out.println(body);
         
        return businesses;

    
        //find out the id of the truckName with api call above

        // Object[] result = restTemplate.getForObject("https://api.yelp.com/v3/businesses/{id}", Object[].class);
        // System.out.println(result);
        // return Arrays.asList(result); //convert the Object array to a list of Object
    }
}