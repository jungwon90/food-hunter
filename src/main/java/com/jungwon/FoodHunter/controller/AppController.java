package com.jungwon.FoodHunter.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@RestController
public class AppController {
    // @RequestMapping("/") //used with @Controller annotaion
    // public String homepage(){
    //     return "index";
    // }

    @Autowired
    private RestTemplate restTemplate;

    private static String url = "https://data.sfgov.org/resource/rqzj-sfat.json?facilitytype=Truck";

    @GetMapping("/search")
    public List<Object> getSearchResult(){
        Object[] result = restTemplate.getForObject(url, Object[].class);
        System.out.println(result);
        return Arrays.asList(result); //convert the Object array to a list of Object
    }
}
