package com.jungwon.FoodHunter.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;



@Controller
public class AppController {
    @RequestMapping("/")
    public String homepage(){
        return "index";
    }

 
    // @GetMapping("/search")
    // public String searchFormSubmit(@ModelAttribute Search search, Model model){
    //     model.addAttribute("search", search);

    //     //api call
    //     final String url = "https://data.sfgov.org/resource/rqzj-sfat.json";

    //     RestTamplate RestTamplate = new RestTamplate();

    //     return "search"; //I want to return json data to React
    // }
}
