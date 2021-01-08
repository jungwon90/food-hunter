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
import org.springframework.http.MediaType;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.lang.StringBuilder;
import java.util.HashMap;

import java.lang.reflect.Type;

@RestController
public class YelpReview {
    
    @Value("${api.key}")
    private String apiKey;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private Gson gson;


    @GetMapping("/yelp")
    public Map<String, Object> getYelpData(@RequestParam("address1") String address1 ,@RequestParam("truckName") String truckName){
        System.out.println(address1 + truckName);
        String url = "https://api.yelp.com/v3/businesses/matches?name=" + truckName + "&city=San%20Francisco&state=CA&country=US&address1=" + address1;
        //set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", apiKey);
        headers.set("cache-control", "no-cache");
        //combine the headers
        HttpEntity entity = new HttpEntity(headers);

        
        //---- to get the bussiness id, call Bussiness matches endpoint ----//
        ResponseEntity<String> businesses = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        String body = businesses.getBody();
        System.out.println(body);

        if(body.equals("{\"businesses\": []}")){
            gson = new Gson();
            Type noResType = new TypeToken<Map<String, Object>>(){}.getType();
            Map<String, Object> noRes = gson.fromJson("no yelp data found", noResType);
            
            return noRes;
        }else{
            //remove unnecessart substrings 
            body = body.replace("{\"businesses\": ", "");
            int lastIndex = body.length() - 1;
            StringBuilder strBuilder = new StringBuilder(body);
            strBuilder.replace(lastIndex, lastIndex + 1, "");
            body = strBuilder.toString();
            
            //convert the string to a list of maps
            gson = new Gson();
            Type resultType = new TypeToken<List<Map<String, Object>>>(){}.getType();
            List<Map<String, Object>> result = gson.fromJson(body, resultType);

            //get the id of the result
            String id = String.valueOf(result.get(0).get("id"));
            System.out.println(id);

        

            //---- request business detail and return the json to React ----//
            String detailUrl = "https://api.yelp.com/v3/businesses/" + id;
            ResponseEntity<String> detailReq = restTemplate.exchange(detailUrl, HttpMethod.GET, entity, String.class);
            String detialBody = detailReq.getBody();
            System.out.println(detialBody);

            //convert the type to return the business detail
            Type finalResType = new TypeToken<Map<String, Object>>(){}.getType();
            Map<String, Object> finalRes = gson.fromJson(detialBody, finalResType);
            
            return finalRes;

            // return gson.toJson(detialBody);
        }
    }
}