//
//  SettingsTableViewController.swift
//  refranesMexicanos
//
//  Created by César Guadarrama on 6/7/15.
//  Copyright (c) 2015 César Guadarrama. All rights reserved.
//

import UIKit

class SettingsTableViewController: UITableViewController {

    @IBAction func rateAppButton(sender: AnyObject) {
        UIApplication.sharedApplication().openURL(NSURL(string: "http://itunes.apple.com/app/id994013535")!)
    }
    
    @IBAction func supportButton() {
        UIApplication.sharedApplication().openURL(NSURL(string: "http://cesargdm.com/refranesmexicanos")!)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        UIApplication.sharedApplication().setStatusBarStyle(UIStatusBarStyle.LightContent, animated: true)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
}
