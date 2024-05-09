# Copyright (c) 2024, alaalsalam and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CreateGroup(Document):
	pass

	@frappe.whitelist()
	def get_user(self, advanced_filters: list) -> list:
		if user_list := frappe.get_list(
			self.doctype_list,
			# filters=self.get_filters() + advanced_filters,
			filters= advanced_filters,
			fields=["name","full_name","email","phone"],
		):
			return user_list
