import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../Recipe.model';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;
  recipeIngredients = new FormArray([]);

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(
        this.id,
        new Recipe(
          this.recipeForm.value['recipeName'],
          this.recipeForm.value['description'],
          this.recipeForm.value['imageUrl'],
          this.recipeForm.value['ingredients']
        )
      );
    } else {
      this.recipeService.addRecipe(
        new Recipe(
          this.recipeForm.value['recipeName'],
          this.recipeForm.value['description'],
          this.recipeForm.value['imageUrl'],
          this.recipeForm.value['ingredients']
        )
      );
    }
  }

  private initForm() {
    let recipeName: String = '';
    let recipeImagePath: String = '';
    let recipeDescription: String = '';

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          this.recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, Validators.required),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      recipeName: new FormControl(recipeName, Validators.required),
      imageUrl: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: this.recipeIngredients,
    });
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).controls.push(
      new FormGroup({
        name: new FormControl(),
        amount: new FormControl(),
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }
}
