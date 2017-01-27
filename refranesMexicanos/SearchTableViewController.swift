//
//  SearchTableViewController.swift
//  refranesMexicanos
//
//  Created by César Guadarrama on 1/24/17.
//  Copyright © 2017 César Guadarrama. All rights reserved.
//

import UIKit

class SearchTableViewController: UITableViewController, UISearchBarDelegate {

    @IBOutlet weak var searchBar: UISearchBar!
    let refranes = RefranesBook.refranesArray
    var filteredRefranes:[[String:String]] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        searchBar.delegate = self
        
        for ob: UIView in ((searchBar.subviews[0] )).subviews {
            if let z = ob as? UIButton {
                let btn: UIButton = z
                btn.tintColor = UIColor.white
            }
        }
        
        filteredRefranes = refranes
        
        self.navigationItem.hidesBackButton = true
        
        self.navigationItem.titleView = self.searchBar
        self.definesPresentationContext = true
        
        self.navigationItem.titleView?.becomeFirstResponder()
        
    }
    
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        
        if (searchText != "") {
            filteredRefranes = refranes.filter {($0["refran"]?.lowercased().contains(searchText.lowercased()))!}
        } else {
            filteredRefranes = refranes
        }
        
        tableView.reloadData()
        
    }
    
    func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
        
        self.view.endEditing(false)
        
        let _ = self.navigationController?.popToRootViewController(animated: true)
        
    }
    
    

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        return filteredRefranes.count
    }
    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "refranCell", for: indexPath) as! RefranCell

        let refran = filteredRefranes[indexPath.item]
        cell.textLabel?.text = refran["refran"]
        cell.detailTextLabel?.text = refran["tipo"]
        cell.refran = refran

        return cell
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        view.endEditing(true)
        
        let refranCell = sender as! RefranCell
        let refranesDetailViewController = segue.destination as! RefranesDetailViewController
        
        refranesDetailViewController.refranDictionary = refranCell.refran!
        
    }

}

class RefranCell:UITableViewCell {
    var refran:[String:String]?
    @IBOutlet var TitleLabel: UILabel?
    @IBOutlet var SubtitleLabel: UILabel?
}
