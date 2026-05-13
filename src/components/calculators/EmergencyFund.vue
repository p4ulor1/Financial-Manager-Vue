<script setup></script>

<template>
  <div class="container">
    <div class="card">
      <!-- CARD HEADER -->
      <div class="card-header">
        <h3 class="mb-1">Reserva de Emergência</h3>
        <p class="card-category">- Simule o valor ideal para uma boa reserva de emergência</p>
        <hr/>
      </div>
      <!-- END CARD HEADER -->
      <!-- CARD BODY -->
      <div class="card-body">
        <div class="container">
          <div class="row">
            <div class="col">
              <p class="mb-1">Despesa Fixa Mensal:</p>
              <div class="input-group mb-3">
                <span class="input-group-text">R$</span>
                <input type="text" class="form-control" placeholder="0,00">
              </div>
            </div>

            <div class="col">
              <p class="mb-1">Aporte Mensal:</p>
              <div class="input-group mb-3">
                <span class="input-group-text">R$</span>
                <input type="text" class="form-control" placeholder="0,00">
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <p class="mb-1">Modelo de Trabalho:</p>
              <select class="form-select">
                <option value="CLT"selected>CLT</option>
                <option value="Servidor">Servidor Público</option>
                <option value="Autônomo">Mei/Autônomo/Empreendedor</option>
              </select>
            </div>

            <div class="col"></div>
          </div>
        </div>
      </div>
      <!-- END CARD BODY -->
      <!-- CARD FOOTER -->
      <div class="card-footer">
        <hr/>
        <div class="container p-0">
          <!-- MONTH RESULT ROW -->
          <div class="row">
            <div class="col">
              <h4>Meses Totais:</h4>
            </div>
            <div class="col">
              <h4 class="text-end ">12</h4>
            </div>
          </div>
          <!-- END MONTH RESULT ROW -->
          <!-- RESULT ROW -->
          <div class="row">
            <div class="col">
              <h4>Resultado:</h4>
            </div>
            <div class="col">
              <h4 class="text-end">R$ <span>0,00</span></h4>
            </div>
          </div>
          <!-- END RESULT ROW -->
        </div>
      </div>
      <!-- END CARD FOOTER -->
    </div>
  </div>
</template>

<style lang="scss"></style>
