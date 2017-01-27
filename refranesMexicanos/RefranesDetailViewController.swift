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
    @IBOutlet weak var mosaicView: UIView!
    
    var refranDictionary = [String:String]()
    private var refran:String!
    private var significado:String!
    private var tipo:String!
    private let filledStarImage:UIImage = UIImage(named: "star-full")!
    private let starImage:UIImage = UIImage(named: "star")!
    private let reference = "\nvia Refranes Mexicanos \nhttps://appsto.re/mx/Ff3p7.i"
    
    override func viewDidLoad() {

        super.viewDidLoad()
        UIApplication.shared.setStatusBarStyle(UIStatusBarStyle.lightContent, animated: true)

        refran = refranDictionary["refran"]
        significado = refranDictionary["significado"]
        tipo = refranDictionary["tipo"]
        
        refranLabel.text = refran
        refranDetailLabel.text = significado
        refranTypeLabel.text = tipo

        //Check if refran is in the favorites array
        if refranIsFavorite(refran) {
            favoriteButton.setImage(filledStarImage, for: UIControlState())
        } else {
            favoriteButton.setImage(starImage, for: UIControlState())
        }
        
        mosaicView.backgroundColor = UIColor(patternImage: UIImage(named: "mosaic-\(arc4random_uniform(5))")!)

    }
    
    //Sharing refran
    @IBAction func shareRefran() {
        let textToShare = "\"" + refran + "\""

        let objectsToShare = [textToShare, reference]
        let activityVC = UIActivityViewController(activityItems: objectsToShare, applicationActivities: nil)
        self.present(activityVC, animated: true, completion: nil)
    }
    
    //Look if the refran is in the favorites array
    func refranIsFavorite(_ refran:String) -> Bool {
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

        if refranIsFavorite(refran) == false { //Adding refran to favorites array
            setRefranDictionaries(refranDictionary)
            favoriteButton.setImage(filledStarImage, for: UIControlState())
        } else { //Removing star and deleting from favorites array
            favoritesArray.remove(at: findRefranIndex(refran))
            favoriteButton.setImage(starImage, for: UIControlState())
        }
        
        NotificationCenter.default.post(name: Notification.Name(rawValue: "load"), object: nil)
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
}
