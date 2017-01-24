//
//  InterfaceController.swift
//  refranesMexicanosWatch Extension
//
//  Created by César Guadarrama on 8/19/15.
//  Copyright © 2015 César Guadarrama. All rights reserved.
//

import WatchKit
import Foundation

class InterfaceController: WKInterfaceController {

    let refranesBook = RefranesBook()
    var refran = ""
    var meaning = ""
    var refranDictionary = ["":""]
    
    @IBOutlet var significadoHeadline: WKInterfaceLabel!
    @IBOutlet var refranLabel: WKInterfaceLabel!
    @IBOutlet var significadoLabel: WKInterfaceLabel!
    
    
    func setRefran () -> () {
        refranDictionary = refranesBook.randomRefran()
        
        refran = refranDictionary["refran"]!
        meaning = refranDictionary["significado"]!
        
        refranLabel.setText(refran)
        
        print("Meaning \(meaning)")
        
        if meaning == "" {
            //Hide meaning label
            significadoHeadline.setHidden(true)
            significadoLabel.setHidden(true)
        } else {
            significadoHeadline.setHidden(false)
            significadoLabel.setHidden(false)
            significadoLabel.setText(meaning)
        }
        
        
    }
    
    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        
        setRefran()
    

    }

    @IBAction func nextButton() {
        
        setRefran()

    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }

}
