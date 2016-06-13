//
//  FavoritesListTableViewController.swift
//  refranesMexicanos
//
//  Created by César Guadarrama on 5/26/15.
//  Copyright (c) 2015 César Guadarrama. All rights reserved.
//

import UIKit

//Global refran, needs to be initialized
var selectedRefran:String = String()
var refranMeaning:String = String()
var refranType:String = String()

class FavoritesListTableViewController: UITableViewController {

    var messageLabel:UILabel = UILabel();
    
    var refranDictionary:[String:String] = ["":""]
    var significado:String!
    var refran:String = ""
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        UIApplication.sharedApplication().setStatusBarStyle(UIStatusBarStyle.LightContent, animated: true)
        
        //Declare the message label attributes
        messageLabel.text = "No hay favoritos."
        messageLabel.textColor = UIColor(red: 0.77843, green: 0.77843, blue: 0.77843, alpha: 1.0)
        messageLabel.font = UIFont(descriptor: UIFontDescriptor(), size: 25.0)
        messageLabel.textAlignment = NSTextAlignment.Center;
        
        //Reloading
        NSNotificationCenter.defaultCenter().addObserver(self, selector: #selector(FavoritesListTableViewController.loadList(_:)),name:"load", object: nil)
        NSNotificationCenter.defaultCenter().postNotificationName("load", object: nil)
        
        print("LOOKING AT FAVORITES")
        
    }

    func loadList(notification: NSNotification){
        self.tableView.reloadData()
        //Sets message if there's no favorite
        if favoritesArray.count == 0 {
            messageLabel.hidden = false; //Show messageLabel
            self.tableView.separatorColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.0)
            self.tableView.backgroundView = messageLabel
        } else { //Set message hidden and set back the separator colors
            messageLabel.hidden = true;
            self.tableView.separatorColor = UIColor(red: 0.87843, green: 0.87843, blue: 0.87843, alpha: 1.0)
        }
    }

    //Getting the title value of the touched cell
    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
        print("YOU TOUCHED A CELL!")
        
        //Get the Cell title and asign it to selected(Global)Refran
        selectedRefran = tableView.cellForRowAtIndexPath(indexPath)!.textLabel!.text!
        
        var refranInfo:[String:String] = findRefranInfo(selectedRefran)!
        
        refranMeaning = refranInfo["significado"]! //Get the meaning by searching on the findRefranMeaning method
        refranType = refranInfo["tipo"]!
//        print("FIND REFRAN MEANING\n \(findRefranMeaning(selectedRefran))")

        //THIS IS MADE BECAUSE PREPARE FOR SEGUE IS INITIALIZED BEFORE THIS METHOD, 
        //SO REFRAN COULDN'T GET A VALUE BEFORE PREPARE FOR SEGUE IS INITIALIZED
        //HOWEVER THIS COULD BE ACOMPLISHED DECLARING A GLOBAL VAR
    }
    
    //Setting rows in section --- DONE
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return favoritesArray.count
    }
    
    //Working on...
    func findRefranInfo(refran:String) -> [String:String]? {
        for (var i = 0; i < favoritesArray.count; i += 1) {
            if favoritesArray[i]["refran"] == refran {
                return favoritesArray[i]
            }
        }
        return nil
    }
    
    //Seting cells
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("refranCell", forIndexPath: indexPath) as UITableViewCell
        cell.textLabel?.text = favoritesArray[indexPath.row]["refran"] //Set the refran text to the table
        
        return cell
    }

//    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
//        //Use the segue parameter in the method
//    }
    ///////THIS METHOD WAS NOT EFFECTIVE///////
}
