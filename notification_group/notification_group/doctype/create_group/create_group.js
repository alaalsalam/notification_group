// Copyright (c) 2024, alaalsalam and contributors
// For license information, please see license.txt

frappe.ui.form.on('Create Group', {
	doctype_list: function (frm) {
		// frm.trigger("set_query");
		frappe.model.with_doctype(frm.doc.doctype_list, () => set_field_options(frm));
	},

	refresh: function (frm) {
		frm.disable_save();
		// frm.trigger("load_user");
	},
	load_user(frm) {
		frm
			.call({
				method: "get_user",
				args: {
					advanced_filters: frm.advanced_filters || [],
				},
				doc: frm.doc,
			})
			.then((r) => {
				console.log("------r.message-------")
				console.log("-------------",r)
				// section automatically collapses on applying a single filter
				frm.set_df_property("filters_section", "collapsible", 0);
				frm.set_df_property("advanced_filters_section", "collapsible", 0);

				frm.user = r.message;
				frm.set_df_property("select_employees_section", "hidden", 0);
				frm.events.show_user(frm, frm.user);
			});
	},

	show_user(frm, user) {
		const $wrapper = frm.get_field("user_html").$wrapper;
		frm.user_wrapper = $(`<div class="user_wrapper pb-5">`).appendTo(
			$wrapper
		);
		frm.events.render_datatable(frm, user, frm.user_wrapper);
	},

	render_datatable(frm, data, wrapper) {
		const columns = frm.events.get_columns_for_user_table();
		if (!frm.datatable) {
			const datatable_options = {
				columns: columns,
				data: data,
				checkboxColumn: true,
				checkedRowStatus: false,
				serialNoColumn: false,
				dynamicRowHeight: true,
				inlineFilters: true,
				layout: "fluid",
				cellHeight: 35,
				noDataMessage: __("No Data"),
				disableReorderColumn: true,
			};
			frm.datatable = new frappe.DataTable(
				wrapper.get(0),
				datatable_options
			);
		} else {
			frm.datatable.rowmanager.checkMap = [];
			frm.datatable.refresh(data, columns);
		}
	},

	get_columns_for_user_table() {
		return [
			{
				name: "user",
				id: "name",
				content: __("User"),
			},
			{
				name: "full_name",
				id: "full_name",
				content: __("Name"),
			},
			{
				name: "phone",
				id: "phone",
				content: __("phone"),
			},
			{
				name: "email",
				id: "email",
				content: __("Email"),
			},
		].map((x) => ({
			...x,
			editable: false,
			focusable: false,
			dropdown: false,
			align: "left",
		}));
	},

});

const set_field_options = (frm) => {
	const filter_wrapper = frm.fields_dict.filter_list.$wrapper;
	filter_wrapper.empty();

	frm.filter_list = new frappe.ui.FilterGroup({
		parent: filter_wrapper,
		doctype: frm.doc.doctype_list,
		on_change: () => {
			frm.advanced_filters = frm.filter_list
				.get_filters()
				.reduce((filters, item) => {
					// item[3] is the value from the array [doctype, fieldname, condition, value]
					if (item[3]) {
						filters.push(item.slice(1, 4));
					}
					console.log("------filters------------",filters)

					console.log("------------------")
					console.log("------filters------------",filters.push(item.slice(1, 4)))
					return filters;
				}, []);
				frm.trigger("load_user");

			// frm.trigger("load_employees");
		},
	});
};
