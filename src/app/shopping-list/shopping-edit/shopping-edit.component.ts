import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../services/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingredientName') nameInputRef: ElementRef;
  @ViewChild('ingredientAmount') amountInputRef: ElementRef;
  @ViewChild('formObject', { static: false }) slForm: NgForm;

  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.subscription = this.shoppingListService.editedIngredient.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedIngredient = this.shoppingListService.getIngredient(index);
        this.slForm.setValue({
          itemName: this.editedIngredient.name,
          itemAmout: this.editedIngredient.amount,
        });
      }
    );
  }

  onAddIngredient(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.itemName, value.itemAmout);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(
        this.editedItemIndex,
        newIngredient
      );
      this.editMode = false;
      form.reset();
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
  }

  deleteItem() {
    this.clearForm();
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
  }

  clearForm() {
    this.slForm.reset();
    this.editMode = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
