//
//  SettingsTableViewController.swift
//  refranesMexicanos
//
//  Created by César Guadarrama on 6/7/15.
//  Copyright (c) 2015 César Guadarrama. All rights reserved.
//

import UIKit

class SettingsTableViewController: UITableViewController {

    @IBAction func rateAppButton(_ sender: AnyObject) {
        UIApplication.shared.openURL(URL(string: "http://itunes.apple.com/app/id994013535")!)
    }
    
    @IBAction func supportButton() {
        UIApplication.shared.openURL(URL(string: "http://cesargdm.com/refranesmexicanos")!)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        UIApplication.shared.setStatusBarStyle(UIStatusBarStyle.lightContent, animated: true)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
