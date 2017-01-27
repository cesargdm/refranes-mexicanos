//
//  FavoritesListTableViewController.swift
//  refranesMexicanos
//
//  Created by César Guadarrama on 5/26/15.
//  Copyright (c) 2015 César Guadarrama. All rights reserved.
//

import UIKit

class FavoritesListTableViewController: UITableViewController {

    private var messageLabel:UILabel = UILabel();
    
    var refranDictionary:[String:String] = [String:String]()
    private var significado:String = String()
    private var refran:String = String()
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        UIApplication.shared.setStatusBarStyle(UIStatusBarStyle.lightContent, animated: true)
        
        //Declare the message label attributes
        messageLabel.text = "No hay favoritos."
        messageLabel.textColor = UIColor(red: 0.77843, green: 0.77843, blue: 0.77843, alpha: 1.0)
        messageLabel.font = UIFont(descriptor: UIFontDescriptor(), size: 25.0)
        messageLabel.textAlignment = NSTextAlignment.center;
        
        //Reloading
        NotificationCenter.default.addObserver(self, selector: #selector(FavoritesListTableViewController.loadList(_:)),name:NSNotification.Name(rawValue: "load"), object: nil)
        NotificationCenter.default.post(name: Notification.Name(rawValue: "load"), object: nil)
                
    }

    func loadList(_ notification: Notification){
        self.tableView.reloadData()

        if favoritesArray.count == 0 {
            messageLabel.isHidden = false
            self.tableView.separatorColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 0.0)
            self.tableView.backgroundView = messageLabel
        } else {
            messageLabel.isHidden = true
            self.tableView.separatorColor = UIColor(red: 0.87843, green: 0.87843, blue: 0.87843, alpha: 1.0)
        }
    }


    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return favoritesArray.count
    }
    

    func findRefranInfo(_ refran:String) -> [String:String]? {
        for index in 0 ..< favoritesArray.count {
            if favoritesArray[index]["refran"] == refran {
                return favoritesArray[index]
            }
        }
        return nil
    }
    

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        let cell = tableView.dequeueReusableCell(withIdentifier: "refranCell", for: indexPath) as! RefranCell
        
        let favoriteRefran = favoritesArray[indexPath.row]
        cell.refran = favoriteRefran
        cell.textLabel?.text = favoriteRefran["refran"] //Set the refran text to the table
        
        return cell
        
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        let refranDetailView = segue.destination as! RefranesDetailViewController
        let refranCell = sender as! RefranCell
        
        refranDetailView.refranDictionary = refranCell.refran!
        
    }

}
