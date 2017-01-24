//
//  RefranesDetailViewController.swift
//  refranesMexicanos
//
//  Created by César Guadarrama on 5/26/15.
//  Copyright (c) 2015 César Guadarrama. All rights reserved.
//

import UIKit

class RefranesDetailViewController: UIViewController {

    @IBOutlet var favoriteButton: UIButton!
    @IBOutlet var refranDetailLabel: UILabel!
    @IBOutlet var refranTypeLabel: UILabel!
    @IBOutlet var refranLabel: UILabel!
    
    var segueRefranDictionary:[String:String] = [String:String]()
    var refranDictionary = [String:String]()
    var refran:String!
    var significado:String!
    var tipo:String!
    var filledStarImage:UIImage = UIImage(named: "star-full")!
    var starImage:UIImage = UIImage(named: "star")!
    let reference = "\nvia Refranes Mexicanos \nhttps://appsto.re/mx/Ff3p7.i"
    
    override func viewDidLoad() {

        super.viewDidLoad()
        UIApplication.shared.setStatusBarStyle(UIStatusBarStyle.lightContent, animated: true)

        print(segueRefranDictionary)
//        significado = segueRefranDictionary["significado"]
        
        if (segueRefranDictionary["refran"] != nil) { //If the call comes from a segue...
            refran = segueRefranDictionary["refran"]
            significado = segueRefranDictionary["significado"]
            tipo = segueRefranDictionary["tipo"]
            refranDictionary = segueRefranDictionary
            print("SEGUE")
        } else { //If the call comes from favorites list, it calls the global variables
            refran = selectedRefran
            significado = refranMeaning
            tipo = refranType
            refranDictionary = ["refran":refran,"significado":significado]
            print("FAVORITES")
        }
        
        print("Refran: \(refran)")
        print("Significado: \(significado)")
        
        refranLabel.text = refran //Set refran label to the refran value
        refranDetailLabel.text = significado //Set the meaning label to the significado value
        refranTypeLabel.text = tipo

//        Check if refran is in the favorites array
        if (findRefran(refran) == true) { //Set the star as filled
            favoriteButton.setImage(filledStarImage, for: UIControlState())
        } else { //Set the star as normal
            favoriteButton.setImage(starImage, for: UIControlState())
        }
        print("Refran: \(refranLabel.text)")
        print("Significado: \(refranDetailLabel.text)")
        print("Significado: \(refranDetailLabel.text)")
    }
    
    //Sharing refran
    @IBAction func shareRefran() {
        let textToShare = "\"" + refran + "\""

        let objectsToShare = [textToShare, reference]
        let activityVC = UIActivityViewController(activityItems: objectsToShare, applicationActivities: nil)
        self.present(activityVC, animated: true, completion: nil)
    }
    
    //Look if the refran is in the favorites array
    func findRefran(_ refran:String) -> Bool {
        for index in 0 ..< favoritesArray.count {
            if favoritesArray[index]["refran"] == refran {
                return true
            }
        }
        return false
    }
    
    func findRefranIndex(_ refran:String) -> Int {
        for index in 0 ..< favoritesArray.count {
            if favoritesArray[index]["refran"] == refran {
                return index
            }
        }
        return 0
    }
    
    //Set refran to the favorites array
    func setRefranDictionaries (_ refranDicionary:[String:String]) {
        favoritesArray.append(refranDicionary)
    }
    
    @IBAction func setFavorite() {
        let refran:String = refranLabel.text!

        if (findRefran(refran) == false) { //Adding refran to favorites array
            print("\nREFRAN NOT FOUND SETTING FAVORITE " + refran)
            setRefranDictionaries(refranDictionary)
            favoriteButton.setImage(filledStarImage, for: UIControlState())
        } else { //Removing star and deleting from favorites array
            print("\nREFRAN FOUND... DELETING FROM FAVORITES")
            favoritesArray.remove(at: findRefranIndex(refran))
            favoriteButton.setImage(starImage, for: UIControlState())
        }
        
        //Reloading table
        NotificationCenter.default.post(name: Notification.Name(rawValue: "load"), object: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
}
