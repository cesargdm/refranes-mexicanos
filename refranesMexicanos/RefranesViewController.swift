//
//  FirstViewController.swift
//  refranesMexicanos
//
//  Created by César Guadarrama on 5/26/15.
//  Copyright (c) 2015 César Guadarrama. All rights reserved.
//

import UIKit

var favoritesArray:[[String:String]] = [[String:String]]()

class RefranesViewController: UIViewController {

    @IBOutlet var refranButton: UIButton!
    
    let refranesBook = RefranesBook()
    var refran:String! = ""
    var refranDetail:String = ""
    var lastRefran:String = ""
    var refranDictionary:[String:String] = ["":""]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.tabBarItem.selectedImage = UIImage(named: "sombrero-filled")
        
        //Button text properties
        refranButton.contentHorizontalAlignment = UIControlContentHorizontalAlignment.Left;
        refranButton.contentVerticalAlignment = UIControlContentVerticalAlignment.Center;
        refranButton.contentEdgeInsets = UIEdgeInsetsMake(0, 0, 0, 0);
        
        //Set the refranButton title to a new random refran
        refranDictionary = refranesBook.randomRefran()
        refran = refranDictionary["refran"]! //Get the refran
        refranDetail = refranDictionary["significado"]! //Get the mening of the refran
        refranButton.setTitle(refran, forState: UIControlState.Normal)
        
        //Gesture recognizers
        let swipeLeft = UISwipeGestureRecognizer(target: self, action: #selector(RefranesViewController.leftSwiped))
        let swipeRight = UISwipeGestureRecognizer(target: self, action: #selector(RefranesViewController.rightSwiped))
        swipeRight.direction = UISwipeGestureRecognizerDirection.Right
        swipeLeft.direction = UISwipeGestureRecognizerDirection.Left
        self.view.addGestureRecognizer(swipeLeft)
        self.view.addGestureRecognizer(swipeRight)

    }
    
    //Gesture functions
    func rightSwiped() {
        //To make, get last viewed refran
    }
    
    func leftSwiped() {
        refranDictionary = refranesBook.randomRefran()
        
        refran = refranDictionary["refran"]! //Get the refran
        refranDetail = refranDictionary["significado"]! //Get the meaning of the refran
        refranButton.setTitle(refran, forState: UIControlState.Normal)

    }
    
    //Sends the refran to the DetailView
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        //Use the segue parameter in the method
        if (segue.identifier == "showRefranDetail") {
            //Check if we are passing the information in to the right segue
            let refranesDetailViewController = segue.destinationViewController as! RefranesDetailViewController
            //Sends the refranButton title to the segueLabelText
            refranesDetailViewController.segueRefranDictionary = refranDictionary //Send the whole dictionary
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}