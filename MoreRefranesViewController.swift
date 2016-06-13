//
//  MoreRefranesViewController.swift
//  refranesMexicanos
//
//  Created by César Guadarrama on 6/10/15.
//  Copyright © 2015 César Guadarrama. All rights reserved.
//

import UIKit

class MoreRefranesViewController: UITableViewController {
    
    @IBOutlet weak var showMoreRefranesSwitch: UISwitch!
    
    @IBAction func PurchaseExtensionButton() {
        print("Purchasing extension...")
        let alert = UIAlertController(title: "Comprando extensión", message: "Se esta comprando la extensión...", preferredStyle: UIAlertControllerStyle.Alert)
        alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.Default, handler: nil))
        
        self.presentViewController(alert, animated: true, completion: nil)
    }
    
    @IBAction func RestorePurchasesButton() {
        print("Restoring purchases...")
        let alert = UIAlertController(title: "Restaurando compras", message: "Se estan restaurando las compras...", preferredStyle: UIAlertControllerStyle.Alert)
        alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.Default, handler: nil))
        
        self.presentViewController(alert, animated: true, completion: nil)
        
    }

    @IBAction func ShowMoreRefranesAction() {
        print("Show more refranes is... \(showMoreRefranesSwitch.on)")
    }
    
    override func viewDidLoad() {
        print(self.view.backgroundColor)
    }
}
