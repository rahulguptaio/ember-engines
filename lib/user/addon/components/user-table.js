import Component from "@ember/component";
import layout from "../templates/components/user-table";

export default Component.extend({
  layout,
  init() {
    this._super(...arguments);
      this.columns = [
        {
          name: `Name`,
          valuePath: `name`
        },
        {
          name: `Department`,
          valuePath: `department`
        },
        {
          name: `Supervisor`,
          valuePath: `supervisor`
        }
      ];

      this.rows = [
        {
          name: "Tony Stevens",
          department: "Sales",
          title: "Account Lead",
          supervisor: "Metzler, Douglas"
        },
        {
          name: "Felicia Hogan",
          department: "IT",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        },
        {
          name: "Alexandra Carroll",
          department: "	HR",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        },
        {
          name: "Lillian Gonzales",
          department: "	Finance",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        },
        {
          name: "Sherry Jefferson",
          department: "Marketing",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        },
        {
          name: "Elbert Cole",
          department: "Finance",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        },
        {
          name: "Louis Medina",
          department: "Finance",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        },
        {
          name: "Wade Wallace",
          department: "Finance",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        },
        {
          name: "Wilbur Doyle",
          department: "HR",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        },
        {
          name: "Orlando Owen",
          department: "Finance",
          title: "Accountant",
          supervisor: "Boykin, Russell "
        }
      ];
  }
});
