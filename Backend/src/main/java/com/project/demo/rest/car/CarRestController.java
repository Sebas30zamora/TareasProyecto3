package com.project.demo.rest.car;

import com.project.demo.logic.entity.car.Car;
import com.project.demo.logic.entity.car.CarRepository;
import com.project.demo.logic.entity.game.Game;
import com.project.demo.logic.entity.game.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarRestController {

    @Autowired
    private CarRepository carRepository;


    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'USER')")
    public List<Car> getAllCars(){
        return carRepository.findAll();
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public Car updateCar(@PathVariable Long id, @RequestBody Car car) {
        return carRepository.findById(id)
                .map(existingCar -> {
                    existingCar.setMarca(car.getMarca());
                    existingCar.setModel(car.getModel());
                    existingCar.setYear(car.getYear());
                    return carRepository.save(existingCar);
                })
                .orElseGet(() -> {
                    car.setId(id);
                    return carRepository.save(car);
                });
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public Car addCar(@RequestBody Car car) {
        return  carRepository.save(car);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteCar (@PathVariable Long id) {
        carRepository.deleteById(id);
    }
}